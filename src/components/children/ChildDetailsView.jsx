
import React from 'react';
import { Separator } from "@/components/ui/separator";

export function ChildDetailsView({ child }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Name</p>
            <p>{child.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Age</p>
            <p>{child.age} years</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
            <p>{child.dob}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p>{child.status.charAt(0).toUpperCase() + child.status.slice(1)}</p>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Parent/Guardian</p>
            <p>{child.parent}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Contact Number</p>
            <p>{child.contactNumber}</p>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium">Medical Information</h3>
        
        <div className="mt-2">
          <p className="text-sm font-medium text-muted-foreground">Allergies</p>
          {child.allergies.length > 0 ? (
            <ul className="list-disc list-inside">
              {child.allergies.map((allergy, i) => (
                <li key={i}>{allergy}</li>
              ))}
            </ul>
          ) : (
            <p>No allergies</p>
          )}
        </div>
        
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground">Medical Conditions</p>
          {child.medicalConditions.length > 0 ? (
            <ul className="list-disc list-inside">
              {child.medicalConditions.map((condition, i) => (
                <li key={i}>{condition}</li>
              ))}
            </ul>
          ) : (
            <p>No medical conditions</p>
          )}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium">Emergency Contacts</h3>
        {child.emergencyContacts.length > 0 ? (
          <ul className="list-disc list-inside mt-2">
            {child.emergencyContacts.map((contact, i) => (
              <li key={i}>{contact}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2">No emergency contacts provided</p>
        )}
      </div>
    </div>
  );
}
