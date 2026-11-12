
import React from "react";
import AccountDetailsForm from "./AccountDetailsForm";


export default function IndividualDetails(): React.JSX.Element {
  return (
    <AccountDetailsForm
      pageName="Individual Details"
      showCompanySection={false}
      onSubmit={(values) => console.log("individual", values)}
    />
  );
}