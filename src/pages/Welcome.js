import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      // Decrease time left every second
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Navigate to the home page after 10 seconds
    const redirectTimer = setTimeout(() => {
      navigate('/');
    }, 10000);

    // Cleanup the timers on component unmount
    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div>
      <p style={{ color: '#FFE4C4' }}>
        Welcome to the halfway meeting.
        The site that will organize all the important meetings you won't want to miss with your favorite people

        Our goal is to be a warm and smart home for all the preparations for the meeting from its publication and sharing with other users Online chat with the participants of the meeting Management of favorites and other surprises

        Did you manage to read in {timeLeft} seconds?
      </p>
      <img src="https://secure.meetupstatic.com/photos/event/8/4/3/0/600_501933840.jpeg"/>
    </div>
  );
};

export default Welcome;
