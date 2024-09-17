export interface Video {
  id: string;
  title: string;
  url: string;
  size: number;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  videos: {
    title: string;
    url: string;
  }[];
}