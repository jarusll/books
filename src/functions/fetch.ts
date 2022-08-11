import axios from 'axios';

export async function fetch(uri: string): Promise<string> {
    const response = await axios.get(uri)
    return await response.data
}
