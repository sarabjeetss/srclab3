import React from 'react';

const ContactUs = () => {
  return (
    <div className="contactusArea container mt-5">
      <h2>Contact Us</h2>
      <div className="contactOptions mt-3">
        <div className="option">
          <h3>Live Chat</h3>
          <p>Chat with our support team in real-time for immediate assistance.</p>
          <button className="btn btn-primary">Start Live Chat</button>
        </div>
        <div className="option mt-3">
          <h3>Call</h3>
          <p>Call us at <b>1-800-123-4567</b> for any queries or support.</p>
          <p>              or</p>
             <p>Call at<b> 911</b> in case of emergency.  </p>          
          
          <button className="btn btn-primary">Call Us</button>
        </div>
        <div className="option mt-3">
          <h3>In-Person Appointment</h3>
          <p>Schedule an appointment to visit us in person at our nearest branch.</p>
          <button className="btn btn-primary">Book Appointment</button>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
