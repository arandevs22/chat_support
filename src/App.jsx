import "./style.css";
import banner from "../public/chat_soporte_banner.png"

function App() {
  return (
    <div className="App uk-margin-top uk-container uk-margin-bottom">
      <div id="event-details-container" className="uk-text-center">
        <h1 className="uk-margin-small-top">Chat de Soporte</h1>
        <div>
          <img
            className="banner"
            src={banner}
            alt=""
          />
        </div>
        <p>
          Reporta canales o películas caídas, <br /> dejanos tus comentarios.
        </p>
        <button id="startRsvp">Hacer Reporte o Comentar</button>
      </div>
      <hr />
      <div id="firebaseui-auth-container"></div>
      <div id="description-container" className="uk-text-center">
        <p>Esperamos que estés disfrutando de <br /> HOO PLAY</p>
        <p className="uk-margin-small-bottom" id="number-attending"></p>
      </div>
      <div id="guestbook-container">
        <div className="uk-text-center">
          <h2>¿Te gusta HOO PLAY?</h2>
          <button id="rsvp-yes">SI</button>
          <button id="rsvp-no">NO</button>
        </div>
        <hr />
        <h2>Comentarios</h2>
        <form id="leave-message">
          <label>Deja tu comentario: </label>
          <input className="uk-input" type="text" id="message" />
          <button type="submit">
            <i className="material-icons">send</i>
            <span>ENVIAR</span>
          </button>
        </form>

        <div id="guestbook"></div>
      </div>

    </div>
  );
}

export default App;
