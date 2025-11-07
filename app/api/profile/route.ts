import { getProfileData } from '@/lib/data/profile'

export async function GET() {
  const profileData = await getProfileData()

  if (!profileData) {
    throw new Error('Unable to fetch your profile')
  }

  return Response.json(profileData)
}
