import { useContext, useEffect, useState } from "react";
import Card from "../../ui/Card";
import classes from "./MettupItem.module.css";
import FavoritesContext from "../../store/favorites-context";
import Dialog from "./Dialog";
import { useNavigate } from "react-router-dom";
import { CiMenuKebab } from "react-icons/ci";

function MettupItem(props) {
  const FavoritesCtx = useContext(FavoritesContext);

  const itemIsfavorite = FavoritesCtx.itemIsFavorite(props.id);

  const [meetupData, setMeetupData] = useState({});
  const [isDialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  function toggleFavoritesStatusHandler() {
    if (itemIsfavorite) {
      FavoritesCtx.removeFavorite(props.id);
    } else {
      FavoritesCtx.addFavorite({
        id: props.id,
        title: props.title,
        date: props.date,
        image: props.image,
        address: props.address,
        email: props.user.email,
        favoriteId : ''
      });

      
    }
  }

  useEffect(() => {
    fetch(
      `https://meetup-app-50bbf-default-rtdb.firebaseio.com/meetups/${props.id}.json`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.chatRoomId === "") {
          setMeetupData({ id: "-420" });
        } else {
          setMeetupData(data.chatRoomId);
        }
      });
  }, []);

  useEffect(() => {
    setMeetupData(props.chatRoomId);
  }, [props.chatRoomId]);

  const handleNewRoom = () => {
    if (props.title !== "") {
      fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/rooms.json`, {
        method: "POST",
        body: JSON.stringify({
          title: props.title,
          creator: props.userName,
          image: props.image,
          id: "",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          fetch(
            `https://meetup-app-50bbf-default-rtdb.firebaseio.com/rooms/${data.name}.json`,
            {
              method: "PATCH",
              body: JSON.stringify({ id: data.name }),
            }
          )
            .then((response) => response.json())
            .then((data) => {
              props.handleSetParticipants([props.userName]);
              addFirstParticipant(data.id);
              fetch(
                `https://meetup-app-50bbf-default-rtdb.firebaseio.com/meetups/${props.id}.json`,
                {
                  method: "PATCH",
                  body: JSON.stringify({ chatRoomId: data }),
                }
              );
            })
            .catch((error) => {
              console.error("Error get room id :", error);
            });
        })
        .catch((error) => {
          console.error("Error creating new room:", error);
        });
    }
  };

  const addFirstParticipant = (id) => {
    fetch(
      `https://meetup-app-50bbf-default-rtdb.firebaseio.com/rooms/${id}/Participants.json`,
      {
        method: "POST",
        body: JSON.stringify({
          Participant: props.userName,
        }),
      }
    );
  };

  const canDeleteMeetUp = () => {
    fetch(
      `https://meetup-app-50bbf-default-rtdb.firebaseio.com/meetups/${props.id}.json`
    )
      .then((response) => response.json())
      .then((data) => {
        const creator = data.creator;
        console.log(creator ,"!==" , props.userName);
        if (creator !== props.userName) {
          alert(
            "You are not the creator of this meetup and cannot delete it."
          );
        } else {
          deleteMeetUp();
        }
      });
  };

  const deleteMeetUp = () => {
    console.log("props.id3333", props.id);
    fetch(
      `https://meetup-app-50bbf-default-rtdb.firebaseio.com/meetups/${props.id}.json`
    )
      .then((response) => response.json())
      .then((data) => {
        const meetupId = data.meetupId;

        if (data.chatRoomId != "") {
          fetch(
            `https://meetup-app-50bbf-default-rtdb.firebaseio.com/rooms/${data.chatRoomId.id}.json`,
            {
              method: "DELETE",
            }
          ).catch((error) => {
            console.error("Error deleting room:", error);
          });
          //console.log("nnnnn", data.chatRoomId.id);
        }
        fetch(
          `https://meetup-app-50bbf-default-rtdb.firebaseio.com/favorites.json`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("nnnnnnnn", data);
            //const res = data.map((favorite , index) =>{return favorite === meetupTitle})
            const favoriteKey = data
              ? Object.keys(data).find((key) => data[key].title === props.title)
              : null;
            console.log(`meetupId : ${meetupId} favoKey : ${favoriteKey}`);
            if (favoriteKey) {
              fetch(
                `https://meetup-app-50bbf-default-rtdb.firebaseio.com/favorites/${favoriteKey}.json`,
                {
                  method: "DELETE",
                }
              ).catch((error) => {
                console.error("Eror deleting favorite : ", error);
              });
            }
          });
        fetch(
          `https://meetup-app-50bbf-default-rtdb.firebaseio.com/meetups/${props.id}.json`,
          {
            method: "DELETE",
          }
        )
          .then((response) => response.json())
          .then((data) => {
            props.handleSetParticipants([]);
          })
          .catch((error) => {
            console.error("Error deleting meetup:", error);
          });
      });
  };

  return (
    <li className={classes.item}>
      <Card>
        <div className={classes.image}>
          <img src={props.image} alt={props.title} />
        </div>
        <div className={classes.content}>
          <h3>{props.title}</h3>
          <address>{props.address}</address>
          <p>{new Date(props.date).toLocaleDateString()}</p>
          <p>{props.description}</p>
          <p>{props.postBy}</p>
        </div>
        <div className={classes.actions}>
          <button
            style={{ margin: "12px", marginRight: "4px" }}
            onClick={toggleFavoritesStatusHandler}
          >
            {itemIsfavorite ? "Remove from Favorites" : "To Favorites"}
          </button>
          <button
            style={{
              margin: "12px",
              opacity:
                meetupData.id !== "-420" && meetupData.id !== "" ? 0.5 : 1,
              cursor:
                meetupData.id !== "-420" && meetupData.id !== ""
                  ? "not-allowed"
                  : "pointer",
            }}
            onClick={handleNewRoom}
            disabled={meetupData.id !== "-420" && meetupData.id !== ""}
          >
            {" "}
            make the first move
          </button>
          <button
            style={{ margin: "12px", marginLeft: "4px" }}
            onClick={canDeleteMeetUp}
          >
            we finish here...
          </button>
          <CiMenuKebab onClick={openDialog} size={35} />
          <Dialog
            isOpen={isDialogOpen}
            onClose={closeDialog}
            title={props.title}
            content={props.description}
            id={props.id}
            image={props.image}
            address={props.address}
            userName={props.userName}
            date={props.date}
          />
        </div>
      </Card>
    </li>
  );
}
export default MettupItem;
