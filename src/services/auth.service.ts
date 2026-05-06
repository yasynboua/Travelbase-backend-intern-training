import {
    ForgotPasswordDTO,
    IService,
    LoginDTO,
    RefreshTokenDTO,
    SignupDTO,
    VerifyDeviceChangeOTPDTO
} from "../interfaces";

import {prisma} from "../lib/db";
import {BadRequestError, CustomErrorCode} from "../exceptions";

// Souce of Truth -> Database

class AuthService {

    static initialize() {
        new AuthService();
    }

    public static async signup(input: SignupDTO): Promise<IService> {

        const {email} = input;
        const existingUser = await prisma.users.findUnique({
            where: {
                email
            }
        });

        if (existingUser) {
            throw new BadRequestError({
                msg: "Account with the email already exists",
                errorCode: CustomErrorCode.DUPLICATE_RESOURCE
            });
        }
        // internals of this is that, const allocate a fixed memory space in the heap for the object we aare assigning it to.

        // let and var are different from const in that, they can be re-assigned to a different value or object, while const cannot be re-assigned. However, the properties of an object assigned to a const variable can still be modified.

        return {
            success: true,
            message: "Signup successful",
            data: {}
        }
    }

    public static async login(input: LoginDTO): Promise<IService> {

        //check if the user email is valid and verify the user exist in the database
        // verify they are using the right password...
        // verify the deviceId is a recognised device, if not,
        // we send an email OTP to the user email to let them know that an
        // unrecognised device is trying to access their account from a location
        // that is not recognised.
        // if the device is not recognised, we block the user from logging in and sent them email OTP to verify their identity.

        // if all are true, we generate a JWT tokens and return it to the client.

        return {
            success: true,
            message: "Login successful",
            data: {
                accessToken: "",
                refreshToken: "",
                user: {}
            }
        }
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