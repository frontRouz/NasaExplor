const KEYS = [
  'v8nOLdRz0YgG2VGWcRLkyRJnhN4ZgfEV8S8lo11M',
  'xMUnoHfaBiP0U1GVTTxCwilmWbThgFoeFZGgj2ic',
  'Lj64S7AgZhPzONIscHHdRSfLShBZ96vscqfT7X9c'
];

function randomKey() {
  return KEYS[Math.floor(Math.random() * KEYS.length)];
}

exports.handler = async function (event, context) {
  // دریافت تاریخ‌ها از فرانت‌اندمان
  const { start_date, end_date } = event.queryStringParameters;
  const apiKey = randomKey();
  
  const targetUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${start_date}&end_date=${end_date}`;

  try {
    // سرور نتلیفای به سرور ناسا درخواست می‌زند
    const response = await fetch(targetUrl);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // حل مشکل محدودیت CORS
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed fetching data from NASA" }),
    };
  }
};
