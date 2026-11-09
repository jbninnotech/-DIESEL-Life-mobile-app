import React from "react";
import AccountDetailsForm from "./AccountDetailsForm";

export default function OrganizationDetails(): React.JSX.Element {
  return (
    <AccountDetailsForm
      pageName="Organization Details"
      showCompanyName
      companyLabel="Company Name"
      onSubmit={(values) => {
        // TODO: save organization details and go to the next screen
        console.log("organization", values);
      }}
    />
  );
}