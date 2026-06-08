'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useUserStore } from '@/stores/userStore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { formatNumber } from '@/lib/utils';
import { Play, Pause, Download, Heart, Search, Music2, Loader2 } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  description: string | null;
  audioUrl: string;
  coverUrl: string | null;
  durationSeconds: number;
  genre: string | null;
  playCount: number;
  downloadCount: number;
  isFeatured: boolean;
  artist: {
    id: string;
    stageName: string;
    avatarUrl: string | null;
    isVerified: boolean;
  };
}

export default function MusicPage() {
  const { isAuthenticated } = useUserStore();
  const { toast } = useToast();
  const [songs, setSongs] = useState<Song[]>([]);
  const [featuredSongs, setFeaturedSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      const [allSongs, featured] = await Promise.all([
        api.getSongs(1, 20),
        api.getFeaturedSongs(),
      ]);
      setSongs(allSongs.songs);
      setFeaturedSongs(featured.songs);
    } catch (error) {
      console.error('Failed to load songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStream = async (song: Song) => {
    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please login to stream and earn coins',
      });
      return;
    }

    setPlayingId(song.id);

    try {
      // Simulate streaming for 30+ seconds
      await api.streamSong(song.id, 35);

      toast({
        title: 'Stream recorded! 🎵',
        description: `You earned 1 coin. ${song.artist.stageName} was credited.`,
      });

      loadSongs();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Streaming failed',
        description: error.message,
      });
    } finally {
      setPlayingId(null);
    }
  };

  const handleDownload = async (song: Song) => {
    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please login to download songs',
      });
      return;
    }

    try {
      const result = await api.downloadSong(song.id);

      toast({
        title: 'Download recorded! 📥',
        description: 'You earned 3 coins',
      });

      loadSongs();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Download failed',
        description: error.message,
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredSongs = searchQuery
    ? songs.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.artist.stageName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : songs;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Music</h1>
        <p className="mt-2 text-muted-foreground">
          Stream music and earn CMP Coins
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search songs or artists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border bg-background py-3 pl-10 pr-4 text-sm"
        />
      </div>

      {/* Featured Songs */}
      {!searchQuery && featuredSongs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Featured</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {featuredSongs.slice(0, 5).map((song) => (
              <div
                key={song.id}
                className="group relative rounded-lg border bg-card overflow-hidden"
              >
                <div className="aspect-square bg-muted relative">
                  {song.coverUrl ? (
                    <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music2 className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full"
                      onClick={() => handleStream(song)}
                      disabled={playingId === song.id}
                    >
                      {playingId === song.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium truncate">{song.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {song.artist.stageName}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatNumber(song.playCount)} plays</span>
                    <span>{formatDuration(song.durationSeconds)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Songs */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {searchQuery ? `Results for "${searchQuery}"` : 'All Songs'}
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredSongs.length > 0 ? (
          <div className="space-y-2">
            {filteredSongs.map((song, index) => (
              <div
                key={song.id}
                className="flex items-center gap-4 rounded-lg border bg-card p-3 hover:bg-accent transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded bg-muted text-muted-foreground">
                  <Music2 className="h-6 w-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{song.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {song.artist.stageName}
                    {song.artist.isVerified && ' ✓'}
                  </p>
                </div>

                <div className="hidden sm:block text-sm text-muted-foreground">
                  {formatDuration(song.durationSeconds)}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStream(song)}
                    disabled={playingId === song.id}
                  >
                    {playingId === song.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4 mr-1" />
                    )}
                    Stream
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDownload(song)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Music2 className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No songs found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'Try a different search term' : 'Check back later for new music'}
            </p>
          </div>
        )}
      </div>

      {/* Earn Info */}
      <div className="mt-8 rounded-lg border bg-muted p-4">
        <h3 className="font-semibold">Earn Coins</h3>
        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <p>Stream a song for 30+ seconds: 1 coin</p>
          <p>Download a song: 3 coins</p>
          <p className="mt-2">
            Artists earn from their music streams and downloads!
          </p>
        </div>
      </div>
    </div>
  );
}