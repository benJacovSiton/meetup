import { useEffect, useState } from "react";
import MeetupLists from "../components/meetup/MeetupLists";
import { getAuth, signOut } from "firebase/auth";
import { app, getDatabase, ref, onValue, off } from './../components/rooms/firebase-config';

function AllMeetups(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedMeetups, setLoadedMeetups] = useState([]);
  const [isMeetUp , setIsMeetUp] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const database = getDatabase();
    const meetupRef = ref(database, 'meetups');

    const handleData = (snapshot) => {
      if (snapshot.val()) {
        const meetups = [];

        for (const key in snapshot.val()) {
          const meetup = {
            id: key,
            ...snapshot.val()[key]
          };
          meetups.push(meetup);
        }

        meetups.reverse();

        setIsLoading(false);
        setLoadedMeetups(meetups);
        //console.log(meetups);
      }
      else{
        setIsMeetUp(false);
        //console.log("setIsMeetUp111111",isMeetUp);
      }
    };

    // Attach the event listener
    onValue(meetupRef, handleData);

    // Detach the event listener when the component unmounts
    return () => {
      off(meetupRef, handleData);
    };
  }, []);

  // if (isLoading) {
  //   return (
  //     <section>
  //       <h2>Loading...</h2>
  //     </section>
  //   );
  // }

  if(!isMeetUp){
    return (
      <section>
      <h2>No MeetUp...</h2>
      <h5>add some bro...</h5>
    </section>
    )
  }

  return (
    <section>
      <h1 style={{color:'AntiqueWhite'}}>All Meetup</h1>
      <MeetupLists meetups={loadedMeetups} userName={props.userName} handleSetParticipants={props.handleSetParticipants} roomId= {props.roomId} user={props.user} />
    </section>
  );
}

export default AllMeetups;
