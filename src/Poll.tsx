import {
  MessageType,
  PSActivePokemon,
  PSMoveInfo,
  PSSideInfo,
  PSSidePokemon,
} from "./types.ts";
import React, { useEffect, useState } from "react";
import { useWebSocket } from "./WebsocketContext.tsx";

export function MoveButton({
  move,
  idx,
  tera,
}: {
  move: PSMoveInfo;
  idx: number;
  tera: boolean;
}) {
  const { send } = useWebSocket();
  return (
    <button
      disabled={move.disabled}
      onClick={() => {
        send(
          JSON.stringify({
            type: MessageType.Vote,
            content: {
              from: "client",
              type: "move",
              idx: idx,
              tera: tera,
            },
          }),
        );
      send(
        JSON.stringify({
          type: MessageType.UpdateRequest,
          content: {
            voted: false,
          },
        }),
      );
      }}
    >
      {move.move} {move.pp}/{move.maxpp} <br /><hr />{" "}
      {move.votes !== undefined ? (move.votes * 100).toFixed(1) + "%" : <br />}{" "}
    </button>
  );
}

export function SideButton({
  pokemon,
  idx,
}: {
  pokemon: PSSidePokemon;
  idx: number;
}) {
  const { setDetails } = useWebSocket();
  return (
    <button
      onClick={() => {
        setDetails(idx)
      }}
    >
      {pokemon.details} {pokemon.condition} <br />< hr />{" "}
      {pokemon.votes !== undefined
        ? (pokemon.votes * 100).toFixed(1) + "%"
        : ""}{<br />}
    </button>
  );
}

export function ActiveSelection({
  active,
}: {
  active: PSActivePokemon;
}) {
  const [tera, setTera] = useState(false);
  return (
    <div id="moves">
      {active.moves.map((m, i) => (
        <MoveButton move={m} key={i} idx={i} tera={tera} />
      ))}
      <br />
      {active.canTerastallize !== "" && (
        <>
          <input
            type="checkbox"
            checked={tera}
            id="tera"
            onChange={() => {
              setTera(!tera);
            }}
          ></input>
          <label htmlFor="tera">
            Terastallize ({active.canTerastallize}){" "}
            {active.teraVotes !== undefined
              ? (active.teraVotes * 100).toFixed(1) + "%"
              : ""}
          </label>
        </>
      )}
    </div>
  );
}

export function SideSelection({
  side,
}: {
  side: PSSideInfo;
}) {
  return (
    <div id="moves">
      {side.pokemon.map((p, i) => (
        <SideButton pokemon={p} idx={i} key={i}/>
      ))}
    </div>
  );
}

function SideDetails({
  mon,
  idx
}: {
  mon: PSSidePokemon,
  idx: number
}) {
  const { send } = useWebSocket();
  return(
    <div id="sideDetails">
      <p>{mon.details}</p>
      <p>Tera Type: {mon.teraType}</p>
      <p>HP: {mon.condition}</p>
      <p>Ability: {mon.ability} / Item: {mon.item} </p>
      <p>Atk {mon.stats["atk"]} / Def {mon.stats["def"]} / SpA 
        {mon.stats["spa"]} / SpD {mon.stats["spd"]} / Spe {mon.stats["spe"]}</p>
      <ul>
        {mon.moves.map((m) => (
          <li>{m}</li>
        ))}
      </ul>
    <button
      onClick={() => {
        send(
          JSON.stringify({
            type: MessageType.Vote,
            content: {
              from: "client",
              type: "switch",
              idx: idx,
              tera: false,
            },
          }),
        );
      send(
        JSON.stringify({
          type: MessageType.UpdateRequest,
          content: {
            voted: false,
          },
        }),
      );
      }}
    >
      Select
      </button>
    </div>
  )
}

export function Poll() {
  const { isReady, active, display_message, pollState, voted, send, details } = useWebSocket();
  useEffect(() => {
    const timer = setInterval(() => {
      send(
        JSON.stringify({
          type: MessageType.UpdateRequest,
          content: {
            voted: voted,
          },
        }),
      );
    }, 5000);
    return () => clearInterval(timer);
  });
  if(!isReady) {
    return (
      <>
      <p>Trying to establish connection to server...</p>
      <p>If this takes more than a minute, please refresh.</p>
      <p>Please note that the server may not be online.</p>
      </>
    )
  }
  return (
    <>
      <p>{display_message}</p>
      {active &&
        pollState?.active?.map((a, i) => (
          <ActiveSelection active={a} key={i} />
        ))}
      {active && (
        <SideSelection
          side={pollState?.side ?? { name: "", id: "", pokemon: [] }}
        />
      )}
      {details >= 0 && pollState !== undefined && 
      (<SideDetails mon={pollState.side.pokemon[details]} idx={details}></SideDetails>)}
    </>
  )
}