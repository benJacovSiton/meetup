import { useNavigate } from 'react-router-dom';
import NewMeetupForm from "../components/meetup/NewMeetupForm";

function NewMeetups(props) {
    const navigate = useNavigate();

    function addMeetupHandler(meetupData) {
        fetch('https://meetup-app-50bbf-default-rtdb.firebaseio.com/meetups.json', {
            method: 'POST',
            body: JSON.stringify(meetupData),
        })
        .then((response) => response.json())
        .then((data)=>{
            console.log("meetupid",data.name);
            fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/meetups/${data.name}.json`, {
                method: 'PATCH',
                body: JSON.stringify({chatRoomId : "" , meetupId : data.name })
            })
            navigate('/'); 
        })
        
           
               
        
    }

    return (
        <section>
            <h1 style={{color : '#FFF8DC'}}>Add New Meetup</h1>
            <NewMeetupForm onAddMeetup={addMeetupHandler} userName={props.userName} />
        </section>
    )
}

export default NewMeetups;
