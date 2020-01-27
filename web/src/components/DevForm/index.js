import React, { useState, useEffect } from 'react';

import './styles.css';

export default function DevForm({ onSubmit }) {
  const [user, setUser] = useState({
    github_username: '',
    techs: '',
  });

  const [coords, setCoords] = useState({
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setCoords({ latitude, longitude });
      },
      (err) => {
        console.log(err);
      },
      {
        timeout: 30000,
      }
    );
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    await onSubmit({
      ...user,
      ...coords,
    });

    setUser({
      github_username: '',
      techs: '',
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-block">
        <label htmlFor="github_username">Usuário do Github</label>
        <input
          id="github_username"
          name="github_username"
          onChange={e => setUser({ ...user, github_username: e.target.value })}
          required
          value={user.github_username}
        />
      </div>

      <div className="input-block">
        <label htmlFor="techs">Tecnologias</label>
        <input
          id="techs"
          name="techs"
          onChange={e => setUser({ ...user, techs: e.target.value })}
          required
          value={user.techs}
        />
      </div>

      <div className="input-group">
        <div className="input-block">
          <label htmlFor="latitude">Latitude</label>
          <input
            id="latitude"
            name="latitude"
            onChange={e => setCoords({ ...coords, latitude: e.target.value })}
            required
            type="number"
            value={coords.latitude}
          />
        </div>

        <div className="input-block">
          <label htmlFor="longitude">Longitude</label>
          <input
            id="longitude"
            name="longitude"
            onChange={e => setCoords({ ...coords, longitude: e.target.value })}
            required
            type="number"
            value={coords.longitude}
          />
        </div>
      </div>

      <button type="submit">Salvar</button>
    </form>
  );
}
