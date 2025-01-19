import { useState, useEffect, FC } from 'react';
import './welcome.scss';
import { User } from '../../../types/partialUser';

const Welcome: FC<{ me: User }> = ({ me: user }) => {
  const text = `Welcome ${user.name}`;
  const [formattedText, setFormattedText] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const chars = text.split('');
    const spans = chars.map((char, index) => (
      <span key={index} className='char'>
        {char}
      </span>
    ));
    setFormattedText(spans);
  }, [user.name]);

  return (
    <>
      <div className='container'>
        <span className='txt anim-text-flow'>{formattedText}</span>
        <div className='txt anim-text-flow'>Have a nice day</div>
      </div>
      <a target='_blank' rel='noopener noreferrer' href='#'>
        @ Powered by MSA
      </a>
    </>
  );
};

export default Welcome;
