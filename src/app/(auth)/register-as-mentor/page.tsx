import MentorProfileForm from '@/components/forms/registerAsMentorForm'

import { Get_All_Skills_For_Register_As_Mentor_Form_Server_Action } from '@/server/actions/auth/registerAsMentor/get-all-skills.server-action';



async function RegisterAsMentor() {
  const res = await Get_All_Skills_For_Register_As_Mentor_Form_Server_Action()

  if (!res.success||!res.data) return <div>Failed to Fetch Skills {res.message}</div>;


  return (
    <div className='w-full'>
      <MentorProfileForm availableSkills={res.data} />
    </div>
  )
}

export default RegisterAsMentor