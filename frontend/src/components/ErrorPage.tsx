import { useRouteError, isRouteErrorResponse } from "react-router-dom";

// export default function ErrorPage() {
//   const error = useRouteError();
//   console.error(error);

//     if (isRouteErrorResponse(error)) {
//       return (
//         <div id="error-page">
//           <h1>Oops! {error.status}</h1>
//           <p>{error.statusText}</p>
//           {error.data?.message && (
//             <p>
//               <i>{error.data.message}</i>
//             </p>
//           )}
//         </div>
//       );
//   } else if (error instanceof Error) {
//     return (
//       <div id="error-page">
//         <h1>Oops! Unexpected Error</h1>
//         <p>Something went wrong.</p>
//         <p>
//           <i>{error.message}</i>
//         </p>
//       </div>
//     );
//   } else {
//     return <>"Huh"</>;
//   }
// }

function ErrorPage() {
  return (
    <div style={{backgroundImage: `url('https://c.tenor.com/on1mjVGlxUgAAAAd/tenor.gif')`, backgroundSize: "cover"}}>

    </div>
  )
}

export default ErrorPage;