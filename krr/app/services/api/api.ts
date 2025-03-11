/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import { ApiResponse, ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import type { ApiConfig, ApiFeedResponse } from "./api.types"
import type { EpisodeSnapshotIn } from "../../models/Episode"
import axios from 'axios';
import { Platform } from "react-native";

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async getEpisodes(): Promise<{ kind: "ok"; episodes: EpisodeSnapshotIn[] } | GeneralApiProblem> {
    // make the api call
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api.json?rss_url=https%3A%2F%2Ffeeds.simplecast.com%2FhEI_f9Dx`,
    )

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data

      // This is where we transform the data into the shape we expect for our MST model.
      const episodes: EpisodeSnapshotIn[] =
        rawData?.items.map((raw) => ({
          ...raw,
        })) ?? []

      return { kind: "ok", episodes }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
}

const BASE_URL = // Added this part that works for various platforms
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/api" // Android emulator (maps to your localhost)
    : Platform.OS === "ios"
    ? "http://localhost:3000/api" // iOS simulator
    : "http://localhost:3000/api"; // For react-native-web or others
 
// Insertion APIs
export async function insertMedical(data: {
  User_ID: string;
  Symptom: string;
  Diagnosis: string;
  Datetime: string;
}): Promise<any> {
  try {
    const response = await axios.post(`${BASE_URL}/insert/medical`, data);
    return response.data;
  } catch (error) {
    console.error('Error inserting medical record:', error);
    throw error;
  }
}

export async function insertVitals(data: {
  User_ID: string;
  Temperature: number;
  BloodPressure: string;
  PulseRate: number;
  Datetime: string;
}): Promise<any> {
  try {
    const response = await axios.post(`${BASE_URL}/insert/vitals`, data);
    return response.data;
  } catch (error) {
    console.error('Error inserting vitals:', error);
    throw error;
  }
}

export async function insertActivity(data: {
  User_ID: string;
  Activity: string;
  Duration: number;
  Datetime: string;
}): Promise<any> {
  try {
    const response = await axios.post(`${BASE_URL}/insert/activity`, data);
    return response.data;
  } catch (error) {
    console.error('Error inserting activity:', error);
    throw error;
  }
}

export async function insertPrompt(data: {
  User_ID: string;
  Summary: string;
}): Promise<any> {
  try {
    const response = await axios.post(`${BASE_URL}/insert/prompt`, data);
    return response.data;
  } catch (error) {
    console.error('Error inserting prompt:', error);
    throw error;
  }
}

// Query APIs
export async function queryMedical(user: string, prompt: string): Promise<any> {
  try {
    const response = await axios.get(`${BASE_URL}/medical`, {
      params: { user, prompt },
    });
    return response.data;
  } catch (error) {
    console.error('Error querying medical records:', error);
    throw error;
  }
}

export async function queryVitals(user: string): Promise<any> {
  try {
    const response = await axios.get(`${BASE_URL}/vitals`, {
      params: { user },
    });
    return response.data;
  } catch (error) {
    console.error('Error querying vitals:', error);
    throw error;
  }
}

export async function queryActivity(user: string): Promise<any> {
  try {
    const response = await axios.get(`${BASE_URL}/activity`, {
      params: { user },
    });
    return response.data;
  } catch (error) {
    console.error('Error querying activity:', error);
    throw error;
  }
}

export async function queryPrompts(user: string): Promise<any> {
  try {
    const response = await axios.get(`${BASE_URL}/prompts`, {
      params: { user },
    });
    return response.data;
  } catch (error) {
    console.error('Error querying prompts:', error);
    throw error;
  }
}
