import * as soap from 'soap'
import path from 'path'
import { fileURLToPath } from 'url'

// Helper to get absolute path to WSDL
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// WSDL is in src/data, specific path depends on build structure. 
// For dev (vite), src/data/ShipmentTrackingService.wsdl is at ../data/ShipmentTrackingService.wsdl relative to lib
const WSDL_PATH = path.resolve(__dirname, '../data/ShipmentTrackingService.wsdl')

const PUROLATOR_KEY = process.env.PUROLATOR_KEY
const PUROLATOR_PASSWORD = process.env.PUROLATOR_PASSWORD
const PUROLATOR_ENDPOINT = process.env.PUROLATOR_ENDPOINT

export async function getShipmentStatus(pin: string) {
  // Validate credentials
  if (!PUROLATOR_KEY) {
    throw new Error('Missing PUROLATOR_KEY environment variable. Please add it to your .env file.')
  }
  if (!PUROLATOR_PASSWORD) {
    throw new Error('Missing PUROLATOR_PASSWORD environment variable. Please add it to your .env file.')
  }

  // Validate PIN format (Purolator PINs are typically 12 digits)
  if (!pin || typeof pin !== 'string') {
    throw new Error('Invalid PIN format. PIN must be a string.')
  }
  if (!/^\d+$/.test(pin.trim())) {
    throw new Error('Invalid PIN format. PIN must contain only digits.')
  }

  let client: any
  try {
    client = await soap.createClientAsync(WSDL_PATH)

    // Set Endpoint if provided (e.g. for Development)
    // Note: WSDL already contains production endpoint
    // Override only for development/testing
    if (PUROLATOR_ENDPOINT && (PUROLATOR_ENDPOINT.includes('dev') || PUROLATOR_ENDPOINT.includes('test'))) {
      client.setEndpoint(PUROLATOR_ENDPOINT)
    }

    // Set Basic Auth (Purolator requires HTTP Basic Auth)
    client.setSecurity(new soap.BasicAuthSecurity(PUROLATOR_KEY, PUROLATOR_PASSWORD))

    // Prepare Request Headers
    const requestContext = {
      Version: '2.0',
      Language: 'en',
      GroupID: '1',
      RequestReference: 'TrackingRequest',
    }

    client.addSoapHeader({
      RequestContext: requestContext
    }, '', 'tns', 'http://purolator.com/pws/datatypes/v2')

    // Prepare Request Body
    const args = {
      attributes: {
        xmlns: 'http://purolator.com/pws/datatypes/v2'
      },
      TrackingSearchCriteria: {
        searches: {
          search: [
            {
              trackingId: pin.trim(),
            }
          ]
        }
      }
    }

    const [result] = await client.TrackingByPinsOrReferencesAsync(args)
    return result
  } catch (error: any) {
    // Log detailed error for server-side debugging
    console.error('SOAP Error Details:')
    console.error('PIN:', pin)
    console.error('Last Request XML:', client?.lastRequest)

    if (error.response) {
       console.error('Status:', error.response.status)
       console.error('StatusText:', error.response.statusText)
       console.error('URL:', error.config?.url)
       // console.error('Headers:', JSON.stringify(error.response.headers, null, 2))
       console.error('Data:', error.response.data)
    } else {
       console.error(error)
    }

    // Throw a clean, serializable error for the client
    // Seroval dies if we throw the complex Axios/SOAP error containing functions
    const errorMessage = error.message || 'Unknown error'

    // Provide helpful error messages based on the error type
    if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('ENOTFOUND')) {
      throw new Error(`Purolator API connection failed. Please check your internet connection and API endpoint configuration. Details: ${errorMessage}`)
    }
    if (errorMessage.includes('401') || errorMessage.includes('403')) {
      throw new Error(`Purolator API authentication failed. Please verify your PUROLATOR_KEY and PUROLATOR_PASSWORD credentials. Details: ${errorMessage}`)
    }
    if (errorMessage.includes('404')) {
      throw new Error(`Purolator API endpoint not found. Please check PUROLATOR_ENDPOINT configuration. Details: ${errorMessage}`)
    }

    throw new Error(`Purolator API Error: ${errorMessage}`)
  }
}
