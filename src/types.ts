export enum MessageType {
  Poll = "NEW_POLL",
  UpdateRequest = "UPDATE_REQ",
  UpdateResponse = "UPDATE_RESP",
  Vote = "VOTE",
  DisplayText = "DISPLAY_TEXT",
  ShowdownRequest = "PS_REQUEST",
  Results = "RESULTS",
  ClearVote = "CLEAR_VOTE",
  VoteOk = "VOTE_OK",
}

export interface Message {
  type: MessageType;
  content: any;
}

export interface Vote {
  from: number;
  type: string;
  idx: number;
  tera: boolean;
}

export interface UpdateRequestMessage {
  from: number;
  voted: boolean;
}

export interface UpdateResponseMessage {
  results: boolean;
  update: any;
}

export interface DisplayTextMessage {
  clear: boolean;
  err: boolean;
  message: string;
}

export interface PSBattleRequest {
  wait: boolean;
  forceSwitch: boolean[];
  active: PSActivePokemon[];
  side: PSSideInfo;
  rqid: number;
}

export interface PSActivePokemon {
  moves: PSMoveInfo[];
  canTerastallize: string;
  teraVotes?: number;
}

export interface PSMoveInfo {
  move: string;
  id: string;
  pp: number;
  maxpp: number;
  target: string;
  disabled: boolean;
  votes?: number;
}

export interface PSSideInfo {
  name: string;
  id: string;
  pokemon: PSSidePokemon[];
}

export interface PSSidePokemon {
  ident: string;
  details: string;
  condition: string;
  active: boolean;
  stats: { [key: string]: number };
  moves: string[];
  baseAbility: string;
  item: string;
  pokeball: string;
  ability: string;
  commanding: boolean;
  reviving: boolean;
  teraType: string;
  terastallized: string;
  votes?: number;
}
