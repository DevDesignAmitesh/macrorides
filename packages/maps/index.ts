import { SendMapDataToUser } from "@repo/types/types";
import { getEnv } from "./env";

const MAPS_CLIENT_SECRET = getEnv().MAPS_CLIENT_SECRET;
const MAPS_CLIENT_ID = getEnv().MAPS_CLIENT_ID;

if (!MAPS_CLIENT_ID || !MAPS_CLIENT_SECRET) {
  throw new Error("envs not found");
}

class Maps {
  private static instance: Maps | null = null;
  public token: string | null = null;
  public BASE_URL: string = "https://api.olamaps.io/";

  getInstance(): Maps {
    if (!Maps.instance) {
      Maps.instance = new Maps();
    }
    return Maps.instance;
  }

  public async generateToken(): Promise<string> {
    // Data to send
    const saved_envs = {
      grant_type: "client_credentials",
      scope: "openid",
      client_id: MAPS_CLIENT_ID!,
      client_secret: MAPS_CLIENT_SECRET!,
    };
    // Convert object to URL-encoded string

    const data = new URLSearchParams();
    data.append("grant_type", saved_envs.grant_type);
    data.append("scope", saved_envs.scope);
    data.append("client_id", saved_envs.client_id);
    data.append("client_secret", saved_envs.client_secret);

    try {
      const res1 = await fetch(`${this.BASE_URL}/auth/v1/token`, {
        body: data.toString(),
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!res1.ok) {
        throw new Error("Something went wrong while generating token");
      }
      const data1: any = await res1.json();
      const token = data1.access_token;

      return token;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong");
    }
  }

  public async getAutoCompletion(input: string): Promise<SendMapDataToUser[]> {
    try {
      const token = await this.generateToken();
      const res = await fetch(
        `${this.BASE_URL}places/v1/autocomplete?input=${input}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("maps's api is down");
      }

      const data: any = await res.json();

      const sendToUser: SendMapDataToUser[] = [];

      data.predictions.map((item: any) => {
        const title = item.structured_formatting.main_text;
        const shortDesc = item.structured_formatting.secondary_text;
        const longDesc = item.description;
        const location = item.geometry.location;

        sendToUser.push({
          title,
          shortDesc,
          longDesc,
          lat: location.lat,
          lng: location.lng,
        });
      });

      return sendToUser;
    } catch (error) {
      console.log(error);
      throw new Error("Internal server error");
    }
  }
}

export const maps = new Maps().getInstance();
