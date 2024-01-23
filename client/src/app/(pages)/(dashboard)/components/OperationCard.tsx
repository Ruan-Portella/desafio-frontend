import TrashIcon from '../../../../assets/TrashIcon';
import EditIcon from '../../../../assets/EditIcon';
import { useRouter } from 'next/navigation';

interface OperationCardProps {
  id: string,
  deleteFunction: (id: string) => void
}

export default function OperationCard({ id, deleteFunction }: OperationCardProps) {
  const router = useRouter();

  return (
    <div className='flex justify-center'>
      <span
        onClick={(e) => { e.stopPropagation(); router.push(`http://localhost:3000/clients/edit/${id}`) }}>
          <EditIcon className={`hover:fill-gray-600 group-hover:stroke-[white] w-7 h-7 hover:scale-125`}/>
      </span>
      <span className='mx-2'>|</span>
      <span
        onClick={(e) => { e.stopPropagation(); deleteFunction(id) }}>
          <TrashIcon className={`hover:fill-[#F15156] group-hover:stroke-[white] w-7 h-7 hover:scale-125`} />
      </span>
    </div>
  )
}
