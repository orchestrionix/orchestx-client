import { PlaylistType } from "./types";

export async function getRemotePlayerState() {
    //const state: any = await TCPRemotePlayerState();

    // if(state.includes("state")) {
    //   return JSON.parse(state);
    // }

    return {
        state: {
            status: "playing" as any,
            title: '65. Fox -FoxMedley3.mid (04:10)',
            itemId: 5151,
            length: 250000,
            position: 200000,
            volume: 50,
        }
    };
}

export async function getRemotePlayerPlaylist() {
    const playlist: PlaylistType = [
        "2023-05-27_YvesRoussel\\Bolero -Waar ik ga -Corry Konings -00018.mid",
        "2023-05-27_YvesRoussel\\Wals -Musette 02 121t -08011.mid",
        "2023-05-27_YvesRoussel\\Rumba -Le fete du tabac -07008.mid",
        "2023-05-27_YvesRoussel\\Rumba -Amor amor -07015.mid",
        "2023-05-27_YvesRoussel\\Rumba -Delicado -07003.mid",
        "2023-05-27_YvesRoussel\\Fox -Net als vroeger -05018.mid",
        "2023-05-27_YvesRoussel\\Fox -De line dance -05028.mid",
        "2023-05-27_YvesRoussel\\Rumba -Dance on little angel -Elvis Presley -07002.mid",
        "2023-05-27_YvesRoussel\\Bayon -Ansidad -04501.mid",
        "2023-05-27_YvesRoussel\\Bolero -Buona note -00003.mid",
        "2023-05-27_YvesRoussel\\Fox -Daarbij die waterkant -05027.mid",
        "2023-05-27_YvesRoussel\\Bolero -Manuel goodby -00012.mid",
        "2023-05-27_YvesRoussel\\Boogie -Zomer -03010.mid",
        "2023-05-27_YvesRoussel\\Fox -Toch ben je oma -05022.mid",
        "2023-05-27_YvesRoussel\\Wals -Prinsesse accordeon -08015.mid",
        "2023-05-27_YvesRoussel\\Mars -Alte kameraden -05501.mid",
        "2023-05-27_YvesRoussel\\Wals -2nd wals -08000.mid",
        "2023-05-27_YvesRoussel\\Fox -All I ever need is you -05003.mid",
        "2023-05-27_YvesRoussel\\Boogie -Rio Rita -03007.mid",
        "2023-05-27_YvesRoussel\\Wals -Wals vanite -08020.mid",
        "2023-05-27_YvesRoussel\\Boogie -Let it swing -03004.mid",
        "2023-05-27_YvesRoussel\\Step -Kleine Jodeljongen -02006.mid",
        "2023-05-27_YvesRoussel\\Wals -Duitse wals -08023.mid",
        "2023-05-27_YvesRoussel\\Wals -Musette 01 121t -08010.mid",
        "2023-05-27_YvesRoussel\\Rumba -Maantje boven Havanna -07009.mid",
        "2023-05-27_YvesRoussel\\Fox -Goodbye my love -05011.mid",
        "2023-05-27_YvesRoussel\\Wals -Martha -08025.mid",
        "2023-05-27_YvesRoussel\\Step -Amerika -02001.mid",
        "2023-05-27_YvesRoussel\\Rumba -Honolulu -07013.mid",
        "2023-05-27_YvesRoussel\\Twist -Lets dance -03502.mid",
        "2023-05-27_YvesRoussel\\Step -Japanese boy -02005.mid",
        "2023-05-27_YvesRoussel\\Rumba -Judas -07007.mid",
        "2023-05-27_YvesRoussel\\Fox -If i had a chance -BZN -05012.mid",
        "2023-05-27_YvesRoussel\\Wals -Verlaten -08019.mid",
        "2023-05-27_YvesRoussel\\Mars -Berliner luft -05502.mid",
        "2023-05-27_YvesRoussel\\Mars -Singing ay ay yippie yee -05504.mid",
        "2023-05-27_YvesRoussel\\Fox -De derde man -05008.mid",
        "2023-05-27_YvesRoussel\\Wals -Veel bittere tranen -08018.mid",
        "2023-05-27_YvesRoussel\\Rumba -Flaminco -07004.mid",
        "2023-05-27_YvesRoussel\\Tango -Poeme -00504.mid",
        "2023-05-27_YvesRoussel\\Wals -'S nachts aan de donkere boulevard -08017.mid",
        "2023-05-27_YvesRoussel\\Boogie -Frangema boogie -03002.mid",
        "2023-05-27_YvesRoussel\\Wals -Onder de toren -08012.mid",
        "2023-05-27_YvesRoussel\\Bolero -Chou paff -00004.mid",
        "2023-05-27_YvesRoussel\\Wals -Ik hou van U -KorteVersie -08112.mid",
        "2023-05-27_YvesRoussel\\Bolero -Hartebreker -00010.mid",
        "2023-05-27_YvesRoussel\\Fox -Fleur de mon coco -05029.mid",
        "2023-05-27_YvesRoussel\\Bolero -Jou zien huilen kan ik niet -00015.mid",
        "2023-05-27_YvesRoussel\\Rumba -Onbekend01 -07017.mid",
        "2023-05-27_YvesRoussel\\Fox -Theater -05021.mid",
        "2023-05-27_YvesRoussel\\Step -Lambada -02007.mid",
        "2023-05-27_YvesRoussel\\Step -Balalaika -02002.mid",
        "2023-05-27_YvesRoussel\\Tango -Interfr -00502.mid",
        "2023-05-27_YvesRoussel\\Rumba -Onbekend02 -07018.mid",
        "2023-05-27_YvesRoussel\\Fox -Le million d' Arlequin -05016.mid",
        "2023-05-27_YvesRoussel\\Boogie -Piano Twist -03006.mid",
        "2023-05-27_YvesRoussel\\Bolero -Hemelsblauw -00011.mid",
        "2023-05-27_YvesRoussel\\Wals -Pour toi seul -08014.mid",
        "2023-05-27_YvesRoussel\\Fox -12th Street rag -05001.mid",
        "2023-05-27_YvesRoussel\\Bolero -Blijf maar weg bij mij -00001.mid",
        "2023-05-27_YvesRoussel\\Fox -Rock around the clock -05019.mid",
        "2023-05-27_YvesRoussel\\Step -Hopeloos -02009.mid",
        "2023-05-27_YvesRoussel\\Wals -De avond is nog jong -Freddy Breck -08006.mid",
        "2023-05-27_YvesRoussel\\Bolero -Green green gras of home -00006.mid",
        "2023-05-27_YvesRoussel\\Rumba -Onbekend04 -07020.mid",
        "2023-05-27_YvesRoussel\\Rumba -Mooie dag -07014.mid",
        "2023-05-27_YvesRoussel\\Fox -Bye bye -05006.mid",
        "2023-05-27_YvesRoussel\\Bolero -De regenboog -00005.mid",
        "2023-05-27_YvesRoussel\\Fox -Chao bambino -05007.mid",
        "2023-05-27_YvesRoussel\\Step -Que si que no -02010.mid",
        "2023-05-27_YvesRoussel\\Bayon -Tico tico -04504.mid",
        "2023-05-27_YvesRoussel\\Rumba -Monte Video -07010.mid",
        "2023-05-27_YvesRoussel\\Step -Twee verliefde ogen -02011.mid",
        "2023-05-27_YvesRoussel\\Bolero -Verboden dromen -00016.mid",
        "2023-05-27_YvesRoussel\\Wals -Bourasque -08005.mid",
    ];

    return playlist;
}

export async function toggelRemotePlayer() {
    return true;
}

export async function nextRemotePlayer() {
    return true;
}

export async function prevRemotePlayer() {
    return true;
}

