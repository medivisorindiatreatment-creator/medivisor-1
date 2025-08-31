interface AlbumCardProps {
  album: {
    id: string
    title: string
    imageUrl: string
  }
}

export function AlbumCard({ album }: AlbumCardProps) {
  const displayImage = album.imageUrl || "/placeholder.svg"

  return (
    <div className="shadow rounded-md overflow-hidden">
      <img src={displayImage} alt={album.title} className="w-full h-48 object-cover" />
      <div className="p-2 text-center font-medium">{album.title}</div>
    </div>
  );
}
