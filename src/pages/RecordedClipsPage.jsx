import React, { useState } from 'react';
import { useInView } from '../utils/hooks';
import Logo from '../components/Logo';

const RecordedClipsPage = () => {
  const [cardRef, cardVisible] = useInView();
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedPlayer, setSelectedPlayer] = useState('all');
  const [renameValues, setRenameValues] = useState({});
  const [editingClipId, setEditingClipId] = useState(null);

  // Mock data for clips
  const mockClips = [
    {
      id: 1,
      title: 'Dribble magique',
      playerName: 'Mbappé Kylian',
      teamName: 'PSG',
      team: 'team1',
      player: 'player1',
    },
    {
      id: 2,
      title: 'Tir puissant',
      playerName: 'Benzema Karim',
      teamName: 'Real Madrid',
      team: 'team2',
      player: 'player2',
    },
    {
      id: 3,
      title: 'Passe décisive',
      playerName: 'Neymar Jr',
      teamName: 'PSG',
      team: 'team1',
      player: 'player3',
    },
    {
      id: 4,
      title: 'Coup franc spectaculaire',
      playerName: 'Messi Lionel',
      teamName: 'Inter Miami',
      team: 'team3',
      player: 'player4',
    },
    {
      id: 5,
      title: 'Accélération décisive',
      playerName: 'Haaland Erling',
      teamName: 'Manchester City',
      team: 'team1',
      player: 'player1',
    },
    {
      id: 6,
      title: 'Volée sublimée',
      playerName: 'Modric Luka',
      teamName: 'Real Madrid',
      team: 'team2',
      player: 'player2',
    },
    {
      id: 7,
      title: 'Tacle parfait',
      playerName: 'Ramos Sergio',
      teamName: 'Inter Miami',
      team: 'team3',
      player: 'player4',
    },
    {
      id: 8,
      title: 'Tête puissante',
      playerName: 'Cristiano Ronaldo',
      teamName: 'Al Nassr',
      team: 'team2',
      player: 'player3',
    },
  ];

  // Filter clips based on selections
  const filteredClips = mockClips.filter((clip) => {
    const teamMatch = selectedTeam === 'all' || clip.team === selectedTeam;
    const playerMatch = selectedPlayer === 'all' || clip.player === selectedPlayer;
    return teamMatch && playerMatch;
  });

  const handleRenameChange = (clipId, value) => {
    setRenameValues((prev) => ({
      ...prev,
      [clipId]: value,
    }));
  };

  const handleSaveRename = (clipId, currentTitle) => {
    const newTitle = renameValues[clipId] || currentTitle;
    setEditingClipId(null);
    setRenameValues((prev) => ({
      ...prev,
      [clipId]: '',
    }));
  };

  return (
     <div className="min-h-screen bg-dark overflow-hidden">
      <div className="fixed">
        <Logo />
      </div>

      {/* Main Content */}
      <main className="background-color-login w-full min-h-screen flex justify-center items-center flex-col  px-4 pt-16">
        <h1  className='text-center text-primary font-extrabold traking-[-1.2px]  text-4xl mb-11'>Bienvenue [Nom] sur SkillsView Clip</h1>
        <div
          ref={cardRef}
          className={`w-full max-w-5xl rounded-xl p-7 fade-in-up-scroll flex flex-col ${
            cardVisible ? 'visible' : ''
          }`}
          style={{
            backgroundColor: '#00000033',
            borderTop: '1px solid #FFFFFF1A',
            minHeight: 'auto',
            maxHeight: '90vh',
          }}
        >
          {/* Title */}
          <h1 className="text-white text-lg font-medium " style={{ letterSpacing: '-0.36px' }}>
            Dashboard Vidéo
          </h1>

          {/* Subtitle */}
          <p
            className="font-normal mb-5 text-gray-light">
            Parcourez, filtrez et nommez tous les clips vidéo enregistrés.
          </p>

          {/* Filters Section */}
          <div className="flex gap-2 mb-8 justify-center flex-wrap sm:flex-nowrap ">
            {/* Team Filter */}
            <div className="flex flex-col gap-2 w-full sm:w-fit">
              <label className="text-white text-sm">Équipe</label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full lg:w-80 min-w-48 h-9 rounded-lg px-4 text-white  text-sm"
                style={{
                  backgroundColor: '#FFFFFF1A',
                  borderTop: '1px solid #FFFFFF33',
                  border: '1px solid #FFFFFF33',
                }}
              >
                <option value="all">Toutes les équipes</option>
                <option value="team1">PSG</option>
                <option value="team2">Real Madrid</option>
                <option value="team3">Inter Miami</option>
              </select>
            </div>

            {/* Player Filter */}
            <div className="flex flex-col gap-2 w-full sm:w-fit">
              <label className="text-white text-sm font-normal">Joueur</label>
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="w-full lg:w-80  min-w-48  h-9 rounded-lg px-4 text-white  text-sm"
                style={{
                  backgroundColor: '#FFFFFF1A',
                  borderTop: '1px solid #FFFFFF33',
                  border: '1px solid #FFFFFF33',
                }}
              >
                <option value="all">Tous les joueurs</option>
                <option value="player1">Mbappé Kylian</option>
                <option value="player2">Benzema Karim</option>
                <option value="player3">Neymar Jr</option>
                <option value="player4">Messi Lionel</option>
              </select>
            </div>
          </div>

          {/* Clips List */}
          <div className="flex flex-col gap-4 overflow-y-auto flex-1 relative" style={{ maxHeight: 'calc(90vh - 320px)' }}>
            {filteredClips.length > 0 ? (
              filteredClips.map((clip, index) => (
                <div
                  key={clip.id}
                  className=" sm:max-h-20 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3 w-full"
                  style={{
                    backgroundColor: '#FFFFFF1A',
                  }}
                >
                  {/* Clip Info */}
                  <div className="flex-1">
                    <h3 className="text-white text-sm">
                      {clip.title} – {clip.playerName}
                    </h3>
                    <p
                      className="text-xs text-gray-light">
                      {clip.teamName}
                    </p>
                  </div>
                   <button
                    
                      className="h-8 px-4 bg- text-white text-xs bg-primary rounded-lg leading-6 traking-[0.24px] cursor-pointer w-full sm:w-auto"
                    >
                      Télécharger
                    </button>

                   <button
                    
                      className="h-8 px-4 bg- text-white text-xs bg-[#FFFFFF33] rounded-lg leading-6 traking-[0.24px] cursor-pointer w-full sm:w-auto"
                    >
                      Aperçu
                    </button>

                   
                  {/* Rename Input Section */}
                  {editingClipId === clip.id ? (
                    <div className="flex gap-2 w-full sm:w-auto items-center">
                      <input
                        type="text"
                        defaultValue={clip.title}
                        onChange={(e) =>
                          handleRenameChange(clip.id, e.target.value)
                        }
                        placeholder="Nouveau nom..."
                        className="flex-1 sm:flex-none h-8 px-3 py-2 rounded-lg text-white text-sm"
                        style={{
                          backgroundColor: '#FFFFFF1A',
                          border: '1px solid #FFFFFF33',
                          minWidth: '250px',
                        }}
                      />
                      <button
                        onClick={() =>
                          handleSaveRename(
                            clip.id,
                            renameValues[clip.id] || clip.title
                          )
                        }
                        className=" cursor-pointer h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center"
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingClipId(clip.id)}
                      className="h-8 px-4 bg- text-white text-xs bg-[#FFFFFF33] rounded-lg leading-6 traking-[0.24px] cursor-pointer w-full sm:w-auto"
                    >
                      Renommer
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p
                  className="text-sm font-normal"
                  style={{ color: '#FFFFFFCC' }}
                >
                  Aucun clip trouvé avec les filtres sélectionnés.
                </p>
              </div>
            )}
          </div>

          {/* Scroll Indicator
          {filteredClips.length > 4 && (
            <div className="flex justify-center pt-4 mt-2 border-t border-[#FFFFFF1A]">
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs text-gray-light">Plus de clips disponibles</p>
                <svg
                  className="w-4 h-4 text-primary animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>
          )} */}
        </div>
      </main>
    </div>
  );
};

export default RecordedClipsPage;
