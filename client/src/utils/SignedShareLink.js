
async function CreateSignedShareUrl(cid) {
    try {
      const payload = JSON.stringify({
        url: `https://olive-active-aardvark-146.mypinata.cloud/files/${cid}`, // Corrected the URL format
        expires: 500,
        date: Date.now(),
        method: "GET",
      });
  
      const request = await fetch('https://api.pinata.cloud/v3/files/sign', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyY2UyM2MyMC0yYTBkLTQ3MzctOGU5OS01OTljZGQ1NDM5ZDQiLCJlbWFpbCI6ImFiZHVsbW9pemlwaG9uZXhzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI3MzBjYjYyYWViMmMwZjBlYjIwNiIsInNjb3BlZEtleVNlY3JldCI6ImVhMDc3MWE2YjFlYmVlOTA5ODkyNzBlZWQ3ZmU3Y2UzZjdlM2IxY2RlZmMzOGYwOGM0NzRmOGIxYTkzYTQ5MjgiLCJleHAiOjE3NjcyODgyODZ9.rYU-4t7npBdqfOP_HWt79AlAq9wGzMmWoqeKBWAEDgY`,
        },
        body: payload,
      });
      const response = await request.json();
      console.log(response.data)
      return response.data || ""; // Assuming the signed URL is in the response under `data.url`
    } catch (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }
  }

  module.exports = {CreateSignedShareUrl}
  