import {
    ForgotPasswordDTO,
    IService,
    LoginDTO,
    RefreshTokenDTO,
    SignupDTO,
    VerifyDeviceChangeOTPDTO
} from "../interfaces";

import {prisma} from "../lib/db";
import {BadRequestError, CustomErrorCode, UnAuthorizedError} from "../exceptions";
import {generateJwtToken, TOKEN_TYPE, hashPassword, verifyPassword} from "../helpers";

// Souce of Truth -> Database

class AuthService {

    static initialize() {
        new AuthService();
    }

    public static async signup(input: SignupDTO): Promise<IService> {
        const {email, password, firstName, lastName, deviceId} = input;

        const existingUser = await prisma.users.findUnique({where: {email}});
        if (existingUser) {
            throw new BadRequestError({
                msg: "Account with the email already exists",
                errorCode: CustomErrorCode.DUPLICATE_RESOURCE
            });
        }

        const passwordHash = await hashPassword(password);

        // TODO: phone and company fields need to be added to the Users model in schema.prisma
        const user = await prisma.users.create({
            data: {email, firstName, lastName},
        });

        await prisma.userAuths.create({
            data: {userId: user.id, passwordHash},
        });

        const accessToken = generateJwtToken({userId: user.id, email: user.email, deviceId, tokenType: TOKEN_TYPE.AUTH_TOKEN});
        const refreshToken = generateJwtToken({userId: user.id, email: user.email, deviceId, tokenType: TOKEN_TYPE.REFRESH_TOKEN});

        // First device is auto-recognized on signup
        await prisma.userTokens.create({
            data: {userId: user.id, deviceId, accessToken, refreshToken},
        });

        return {
            success: true,
            message: "Signup successful",
            data: {
                accessToken,
                refreshToken,
                user,
            },
        };
    }

    public static async login(input: LoginDTO): Promise<IService> {
        const {email, password, deviceId} = input;

        // 1. Verify user exists
        const user = await prisma.users.findUnique({
            where: {email},
            include: {UserAuths: true},
        });
        if (!user || user.UserAuths.length === 0) {
            throw new UnAuthorizedError({
                msg: "Invalid email or password",
                errorCode: CustomErrorCode.AUTH_INVALID,
            });
        }

        // 2. Verify password
        const userAuth = user.UserAuths[0];
        const passwordMatch = await verifyPassword(password, userAuth.passwordHash);
        if (!passwordMatch) {
            throw new UnAuthorizedError({
                msg: "Invalid email or password",
                errorCode: CustomErrorCode.AUTH_INVALID,
            });
        }

        // 3. Check if device is recognized
        const recognizedToken = await prisma.userTokens.findFirst({
            where: {userId: user.id, deviceId},
        });

        if (!recognizedToken) {
            // Generate a 6-digit OTP and store it with a 10-minute expiry
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

            await prisma.userVerifications.create({
                data: {userId: user.id, token: otp, deviceId, expiresAt},
            });

            // TODO: send OTP to user.email via email service

            throw new UnAuthorizedError({
                msg: "Unrecognized device. A verification code has been sent to your email.",
                errorCode: CustomErrorCode.AUTH_BLOCKED,
            });
        }

        // 4. Device recognized — issue fresh tokens
        const accessToken = generateJwtToken({userId: user.id, email: user.email, deviceId, tokenType: TOKEN_TYPE.AUTH_TOKEN});
        const refreshToken = generateJwtToken({userId: user.id, email: user.email, deviceId, tokenType: TOKEN_TYPE.REFRESH_TOKEN});

        await prisma.userTokens.update({
            where: {id: recognizedToken.id},
            data: {accessToken, refreshToken},
        });

        return {
            success: true,
            message: "Login successful",
            data: {
                accessToken,
                refreshToken,
                user: {id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName},
            },
        };
    }

    public static async verifyDeviceChange(input: VerifyDeviceChangeOTPDTO): Promise<IService> {
        return {
            success: true,
            message: "Device change verified",
            data: {
                accessToken: "",
                refreshToken: "",
                user: {}
            }
        }
    }


    // Refresh Tokens -> These are tokens use in the background to keep the user logged in without them having to re-enter their credentials.
    // They are usually long-lived and can be used to obtain new access tokens when the old ones expire.
    public static async refreshToken(input: RefreshTokenDTO): Promise<IService> {
        return {
            success: true,
            message: "Token refreshed",
            data: {
                accessToken: "",
                refreshToken: "",
                user: {}
            }
        }
    }

    public static async forgotPassword(input: ForgotPasswordDTO): Promise<IService> {
        return {
            success: true,
            message: "Password reset link sent to your email",
        }
    }

    public static async resetPassword(input: ForgotPasswordDTO): Promise<IService> {
        return {
            success: true,
            message: "Password reset successful",
        }
    }

}


export default AuthService;