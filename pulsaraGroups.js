// user groups or teams, i.e. at a hospital
// teams have users, and handle events for various types of patients
// users can be on or off call
const groups = [
  {
    id: 1,
    name: "Emergency Department",
    events: [
      {
        type: "on_inbound_ems",
        patients: ["STEMI", "STROKE", "GENERAL"],
      },
      {
        type: "on_inbound_transfer",
        patients: ["GENERAL"],
      },
      {
        type: "on_consult",
        patients: ["STEMI", "STROKE", "GENERAL"],
      },
    ],
    users: [
      { id: 1, name: "Matthew Kauffman", on_call: false },
      { id: 2, name: "Mackenzie Wicker", on_call: true },
      { id: 5, name: "Doctor Supervisor", on_call: true },
    ],
  },
  {
    id: 2,
    name: "Cardiology",
    events: [
      {
        type: "on_activation",
        patients: ["STEMI"],
      },
      {
        type: "on_inbound_transfer",
        patients: ["STEMI"],
      },
    ],
    users: [
      { id: 3, name: "Chloe Cardiology", on_call: true },
      { id: 5, name: "Doctor Supervisor", on_call: false },
    ],
  },
  {
    id: 3,
    name: "Neurology",
    events: [
      {
        type: "on_activation",
        patients: ["STROKE"],
      },
      {
        type: "on_consult",
        patients: ["STROKE"],
      },
    ],
    users: [{ id: 4, name: "Noel Neurologist", on_call: false }],
  },
  {
    id: 4,
    name: "General Nursing",
    events: [
      {
        type: "on_inpatient",
        patients: ["GENERAL"],
      },
    ],
    users: [
      { id: 6, name: "Bob Bandage", on_call: true },
      { id: 2, name: "Mackenzie Wicker", on_call: true },
    ],
  },
];

/* ----------------------------------------- QUESTION 1 ----------------------------------------- */

/**
 * Return a list of user IDs who should be notified of the given event
 *    -- only on call users for groups configured to handle the event should be included
 * @param {string} eventType - system event, e.g. "on_activation" or "on_inbound_ems"
 * @param {string} patientType - patient type, e.g. "STEMI", "STROKE", or "GENERAL"
 * @returns {int[]}
 */

function onCallUserIdsForEvent(eventType, patientType) {
  let team = [];

  //iterate through the groups
  for (group of groups) {
    let theEvents = group.events;
    let theUsers = group.users;

    //check for type match
    let i = 0;
    let typeMatch = false;

    while (i < theEvents.length && typeMatch === false) {
      if (theEvents[i].type === eventType) {
        typeMatch = true;

        //check for patient match
        if (theEvents[i].patients.includes(patientType)) {
          //on call?
          for (theUser of theUsers) {
            if (theUser.on_call) {
              team.push(theUser.id);
            }
          }
        }
      }
      i++;
    }
  }
  return team;
}

// console.log(onCallUserIdsForEvent("on_inbound_ems", "STROKE"));
// console.log(onCallUserIdsForEvent("on_inpatient", "GENERAL"));
// console.log(onCallUserIdsForEvent("on_consult", "STROKE"));

/* -----------------------------------------   QUESTION 2   ----------------------------------------- */
/**
 * Return group data for which the given user ID is on call
 * @param {int} userId -- the user ID to check
 * @returns {object[]} -- include the ID and name for each group in which the user is on call, i.e.
 *                        [{ "id": 1, "name": "Emergency Department" }]
 */
function onCallGroups(userId) {
  let map = {};

  for (group of groups) {
    for (theUser of group.users) {
      if (theUser.on_call) {
        if (theUser.id in map) {
          map[theUser.id].push({ id: group.id, name: group.name });
        } else {
          map[theUser.id] = [{ id: group.id, name: group.name }];
        }
      }
    }
  }

  return map[userId];
}

// console.log(onCallGroups(2));
// console.log(onCallGroups(5));

// todo(matthew): learn how to test array equality properly in plain JS xD
// console.assert(
//   onCallUserIdsForEvent("on_activation", "STEMI").join(",") === "3"
// );
// console.assert(
//   onCallGroups(2)
//     .map((g) => g.id)
//     .sort()
//     .join(",") === "1,4"
// );
