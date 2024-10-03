import app from "./app.js";

// app.listen(8000, () =>{
//     console.log(`Server listening at port ${8000} `)
// });

app.listen(process.env.PORT, () => {
  console.log(`Server listening at port ${process.env.PORT} `);
});
