import { PinataSDK } from "pinata"

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.PINATA_GATEWAY_URL}`
})
// API Key: 730cb62aeb2c0f0eb206
// API Secret: ea0771a6b1ebee90989270eed7fe7ce3f7e3b1cdefc38f08c474f8b1a93a4928
// JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyY2UyM2MyMC0yYTBkLTQ3MzctOGU5OS01OTljZGQ1NDM5ZDQiLCJlbWFpbCI6ImFiZHVsbW9pemlwaG9uZXhzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI3MzBjYjYyYWViMmMwZjBlYjIwNiIsInNjb3BlZEtleVNlY3JldCI6ImVhMDc3MWE2YjFlYmVlOTA5ODkyNzBlZWQ3ZmU3Y2UzZjdlM2IxY2RlZmMzOGYwOGM0NzRmOGIxYTkzYTQ5MjgiLCJleHAiOjE3NjcyODgyODZ9.rYU-4t7npBdqfOP_HWt79AlAq9wGzMmWoqeKBWAEDgY