// Converts the raw CSV text into an array of learner row objects.
// This is the first step after the browser reads the uploaded file.
export function parseCSV(csvText) {
  const lines = csvText.trim().split("\n");

  const headers = lines[0].split(",").map((header) => header.trim());

  const rows = lines.slice(1).map((line, index) => {
    const values = line.split(",").map((value) => value.trim());

    const row = headers.reduce((object, header, headerIndex) => {
      object[header] = values[headerIndex];
      return object;
    }, {});

    return {
      id: index + 1,
      clientName: row.clientName,
      contractNumber: row.contractNumber,
      learnerName: row.learnerName,
      location: row.location,
      courseName: row.courseName,
      courseType: row.courseType,
      unitsCompleted: Number(row.unitsCompleted),
      totalUnits: Number(row.totalUnits),
      lastProgressDate: row.lastProgressDate || null,
      endDate: row.endDate || null,
      attended: row.attended === "true",
    };
  });

  return rows;
}

// Matches CSV rows to existing contracts from Supabase.
// The CSV only has clientName + contractNumber, but student_records needs contract_id.
export function matchRowsToContracts(rows, contracts) {
  const matchedRows = [];
  const unmatchedRows = [];

  rows.forEach((row) => {
    const matchingContract = contracts.find((contract) => {
      return (
        contract.clientName.toLowerCase() === row.clientName.toLowerCase() &&
        String(contract.contractNumber) === String(row.contractNumber)
      );
    });

    if (!matchingContract) {
      unmatchedRows.push(row);
      return;
    }

    matchedRows.push({
      ...row,
      contract_id: matchingContract.id,
    });
  });

  return {
    matchedRows,
    unmatchedRows,
  };
}

// Converts matched CSV rows into the column names used by the student_records table.
// React uses camelCase, Supabase columns use snake_case.
export function formatStudentRowsForSupabase(rows) {
  return rows.map((row) => ({
    contract_id: row.contract_id,
    learner_name: row.learnerName,
    location: row.location,
    course_name: row.courseName,
    course_type: row.courseType,
    units_completed: row.unitsCompleted,
    total_units: row.totalUnits,
    last_progress_date: row.lastProgressDate,
    end_date: row.endDate,
    attended: row.attended,
  }));
}

// Gets a unique list of contract IDs included in the upload.
// This is used to fetch/delete records only for the contracts affected by the CSV.
export function getUniqueContractIds(rows) {
  return [...new Set(rows.map((row) => row.contract_id))];
}

// Creates a simple matching key so we can compare the same learner/course
// between the old Supabase data and the new CSV data.
function createRecordKey(row) {
  return `${row.contract_id}-${row.learner_name}-${row.course_name}`;
}

// Compares old student records with the new CSV rows.
// Creates recent activity messages when a learner progresses, completes, or attends.
export function compareStudentRecords(existingRows, newRows) {
  const activityItems = [];

  newRows.forEach((newRow) => {
    const matchingExistingRow = existingRows.find((existingRow) => {
      return createRecordKey(existingRow) === createRecordKey(newRow);
    });

    // If the learner/course does not already exist, skip comparison for now.
    // This avoids creating activity for brand new enrolments.
    if (!matchingExistingRow) {
      return;
    }

    const oldUnits = matchingExistingRow.units_completed;
    const newUnits = newRow.units_completed;
    const totalUnits = newRow.total_units;

    const wasCompleted = oldUnits < totalUnits;
    const isNowCompleted = newUnits === totalUnits;

    // Completion gets priority over normal unit progress.
    // Example: Sarah Jones completed Mini MBA
    if (wasCompleted && isNowCompleted) {
      activityItems.push({
        contractId: newRow.contract_id,
        type: "course_completed",
        message: `${newRow.learner_name} completed ${newRow.course_name}`,
      });

      return;
    }

    // Standard progress message.
    // Example: Tom Jones progressed from 6 to 7 units
    if (newUnits > oldUnits) {
      activityItems.push({
        contractId: newRow.contract_id,
        type: "unit_progress",
        message: `${newRow.learner_name} progressed from ${oldUnits} to ${newUnits} units`,
      });
    }

    // Workshop attendance message.
    // Example: Mia Clark attended Presentation Skills
    if (matchingExistingRow.attended !== true && newRow.attended === true) {
      activityItems.push({
        contractId: newRow.contract_id,
        type: "workshop_attended",
        message: `${newRow.learner_name} attended ${newRow.course_name}`,
      });
    }
  });

  return activityItems;
}

// Converts recent activity items into the column names used by the recent_activity table.
export function formatActivityItemsForSupabase(activityItems) {
  return activityItems.map((item) => ({
    contract_id: item.contractId,
    type: item.type,
    message: item.message,
  }));
}
