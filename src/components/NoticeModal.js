import "./NoticeModal.css"

export default function NoticeModal ({onClose})
{
  return (
    <div className="modal-notice-overlay">
      <div className="modal-notice-content">
        <span className="modal-notice-closebtn" onClick={onClose}>
          &times;
        </span>
        <h1>Notice</h1>
        <hr/>
        <ul>
          <li>
          <b>For SSHS-Phys server users</b> <br/>: Add your <u>school email</u> to join the games and see your name on the leaderboard.<br/>
          *Check your school mails on Outlook
          </li>
          <li>
          <b>2 vs 2 mode created!</b> <br/>
          : You'll be assigned to attack or defend, limited to one side of the half line.
          <br/>*This mode won't affect your ranking
          </li>
        </ul>
      </div>
    </div>
  );
};
