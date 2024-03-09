import { EntryRow } from "./EntryRow"


export const Entries = ({type, habits}: {type: string, habits: any}) => {
    return (
    <div className={`Dashboard__${type}`}>
        <div className="List__Label">{type} (x)</div>
        {habits.map((habit: { _id: string }) => (
        <EntryRow key={habit._id + 'key'} habit={habit} />
      ))}
    </div>
    )

}