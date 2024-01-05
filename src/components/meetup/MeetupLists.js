import MettupItem from './MettupItem';
import classes from './MeetupList.module.css';

function MeetupLists(props) {
    // Check if props.meetups is undefined or null
    if (!props.meetups) {
        return null; // or render some alternative content or loading indicator
    }

    return (
        <ul className={classes.list}>
            {props.meetups.map(meetup => (
                <MettupItem
                    key={meetup.id}
                    id={meetup.id}
                    image={meetup.image}
                    title={meetup.title}
                    address={meetup.address}
                    description={meetup.description}
                    userName={props.userName}
                    handleSetParticipants={props.handleSetParticipants}
                    chatRoomId = {meetup.chatRoomId}
                    date = {meetup.date}
                    user ={props.user}
                    postBy = {meetup.creator}
                />
            ))}
        </ul>
    );
}

export default MeetupLists;
