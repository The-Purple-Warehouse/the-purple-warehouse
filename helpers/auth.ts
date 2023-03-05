import config from "../config";
import * as crypto from "crypto";
import Teams from "./team";

type AuthResults = {
    success: boolean;
    message: string;
};

export default async function auth(
    teamNumber: string,
    accessToken: string,
    username: string
): Promise<AuthResults> {
    return new Promise<AuthResults>(async (resolve, reject) => {
        let verifyHash = Buffer.from(
            await Teams.getAccessToken(teamNumber),
            "utf8"
        );

        let requestHash = Buffer.from(
            crypto
                .createHmac("sha256", config.auth.scoutingKeys[0])
                .update(accessToken)
                .digest("hex"),
            "utf8"
        );

        if (crypto.timingSafeEqual(requestHash, verifyHash)) {
            resolve({
                success: true,
                message: "Login was successful"
            });
        } else {
            reject(new Error("Invalid team number or access token"));
        }
    });
}
