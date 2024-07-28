import React from "react";

function VerificationEmail({
  username,
  otp,
}: {
  username: string;
  otp: string;
}) {
  return (
    <html>
      <head>
        <body>
          Hello dear {username}, your otp to verify your email is {otp}
        </body>
      </head>
    </html>
  );
}

export default VerificationEmail;
