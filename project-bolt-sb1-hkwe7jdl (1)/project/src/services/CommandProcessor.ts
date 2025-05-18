import { News } from '../types';

export class CommandProcessor {
  private newsApiKey = "7da57610a08d442b8e3531a4f5dbce61";
  
  async processCommand(command: string, onResponse: (response: string) => void): Promise<boolean> {
    const lowerCommand = command.toLowerCase();
    
    // Commands for opening websites
    if (lowerCommand.includes("open google")) {
      window.open("https://google.com", "_blank");
      onResponse("Of course Sir, here you go...");
      return true;
    }
    
    if (lowerCommand.includes("open facebook")) {
      window.open("https://facebook.com", "_blank");
      onResponse("Of course Sir, here you go...");
      return true;
    }
    
    if (lowerCommand.includes("open music")) {
      window.open("https://open.spotify.com/track/3YZUdbRzjjSn4i8ADgCObA?si=da1968ed882f4e8b", "_blank");
      onResponse("Of course Sir, here you go...");
      return true;
    }
    
    if (lowerCommand.includes("open youtube") || lowerCommand.includes("entertain me")) {
      window.open("https://youtube.com", "_blank");
      onResponse("Of course Sir, here you go...");
      return true;
    }
    
    if (lowerCommand.includes("open linkedin")) {
      window.open("https://linkedin.com", "_blank");
      onResponse("Of course Sir, here you go...");
      return true;
    }
    
    if (lowerCommand.includes("us market")) {
      window.open("https://finviz.com/", "_blank");
      onResponse("Let's go trading...");
      return true;
    }
    
    if (lowerCommand.includes("open camera")) {
      window.open("https://webcammictest.com/", "_blank");
      onResponse("Opening web cam");
      return true;
    }
    
    // Get news
    if (lowerCommand.includes("news")) {
      this.fetchNews().then(headlines => {
        if (headlines.length > 0) {
          onResponse(`Here are today's top headlines: ${headlines.join('. ')}`);
        } else {
          onResponse("I couldn't fetch any news headlines at the moment.");
        }
      });
      return true;
    }
    
    // About Jarvis
    if (lowerCommand.includes("who made you") || lowerCommand.includes("tell me about yourself")) {
      onResponse("I am an artificial Intelligence, I was made by Mr. Hiren Kodwani. Sir made me by thoroughly writing my code base.");
      return true;
    }
    
    // Command not recognized
    return false;
  }
  
  private async fetchNews(): Promise<string[]> {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=in&apiKey=${this.newsApiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      
      const data: News = await response.json();
      
      return data.articles
        .slice(0, 5) // Get only the top 5 articles
        .map(article => article.title);
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }
}