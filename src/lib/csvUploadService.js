import { supabase } from "./supabaseClient";
import {
  getUniqueContractIds,
  formatActivityItemsForSupabase,
} from "./csvUploadHelpers";

export async function getExistingStudentRecords(contractIds) {
  const { data, error } = await supabase
    .from("student_records")
    .select("*")
    .in("contract_id", contractIds);

  if (error) {
    console.error("Existing student records error:", error);
    throw new Error("Could not load existing student records.");
  }

  return data;
}

export async function uploadRowsToSupabase(rowsForSupabase) {
  const contractIds = getUniqueContractIds(rowsForSupabase);

  const { error: deleteError } = await supabase
    .from("student_records")
    .delete()
    .in("contract_id", contractIds);

  if (deleteError) {
    console.error("Delete error:", deleteError);
    throw new Error("Could not clear existing student records.");
  }

  const { data, error: insertError } = await supabase
    .from("student_records")
    .insert(rowsForSupabase)
    .select();

  if (insertError) {
    console.error("Insert error:", insertError);
    throw new Error("Could not upload new student records.");
  }

  return data;
}

export async function saveActivityItems(activityItems) {
  if (activityItems.length === 0) return [];

  const rowsForSupabase = formatActivityItemsForSupabase(activityItems);

  const { data, error } = await supabase
    .from("recent_activity")
    .insert(rowsForSupabase)
    .select();

  if (error) {
    console.error("Recent activity insert error:", error);
    throw new Error("Could not save recent activity.");
  }

  return data;
}

export async function updateContractLastUpload(contractIds) {
  const { error } = await supabase
    .from("contracts")
    .update({ last_upload_at: new Date().toISOString() })
    .in("id", contractIds);

  if (error) {
    console.error("Update last upload error:", error);
    throw new Error("Could not update contract upload date.");
  }
}
