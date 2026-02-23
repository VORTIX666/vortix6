export default async function handler(req, res) {
  if (req.method === "GET") {
    // تحقق فيسبوك
    const VERIFY_TOKEN = "12345"

    if (
      req.query["hub.mode"] === "subscribe" &&
      req.query["hub.verify_token"] === VERIFY_TOKEN
    ) {
      return res.status(200).send(req.query["hub.challenge"])
    }

    return res.status(403).send("Verification failed")
  }

  if (req.method === "POST") {
    console.log("📩 Message:", req.body)

    // هنا تضيف الرد عبر Graph API

    return res.status(200).send("EVENT_RECEIVED")
  }

  res.status(405).end()
}