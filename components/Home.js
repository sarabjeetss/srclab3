import React from 'react';
import LeftImage from './hero-right.jpg';
import './Home.css';

const Home = () => {
  return (
    <div>
      <div className='container'>
        <div className='row'>
          <div className='hero-left col-md-6'>
            <h2>Welcome to <span className='hero-logo'>State Bank Of India</span></h2>
            <p>Start having more effective conversations today and discover the power of SBI in building trust and understanding.</p>
            <button className="hero-button cbtn btn-primary">Open Account with us to get Daily Offers </button>
            
            <p className="info-text"><b>SBI never asks for confidential information such as PIN and OTP from customers. Any such call can be made only by a fraudster. Please do not share personal info.</b></p>
          </div>
          <div className='col-md-6'>
            <img src={LeftImage} alt="Hero" />
          </div>
        </div>

        <BodyArea />
      </div>
    </div>
  );
};

const BodyArea = () => {
  return (
    <div className='row'>
      <div className='body-content col-md-4'>
        <h3>Your Trusted Banking Partner</h3>
        <p>With SBI, you get personalized service, competitive interest rates, and secure banking solutions. Experience banking that truly understands you.</p>
      </div>

      <div className='body-content col-md-4'>
        <h3>Boost Your Business Potential</h3>
        <p> Optimize your business operations with our tailored banking solutions. Enjoy benefits like dedicated relationship managers, quick loan approvals, and more.</p>
      </div>

      <div className='body-content col-md-4'>
        <h3>Digital Banking Services</h3>
        <p>Access your bank anytime, anywhere with SBI’s digital banking services. Enjoy the convenience of mobile banking, internet banking, and more.</p>
      </div>
    </div>
  );
}

export default Home;
