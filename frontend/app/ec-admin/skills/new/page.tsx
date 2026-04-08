import { createSkill } from '../actions'
import SkillForm from '../_components/SkillForm'

export const dynamic = 'force-dynamic'

export default function NewSkillPage() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-neutral-100 mb-1">New Skill</h1>
      <p className="text-neutral-500 text-sm mb-8">Saved as Draft. Toggle Live when ready.</p>
      <SkillForm action={createSkill} />
    </div>
  )
}
