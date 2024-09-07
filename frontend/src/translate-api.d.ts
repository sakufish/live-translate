declare module '@vitalets/google-translate-api' {
    interface TranslateResponse {
      text: string;
      from: {
        language: {
          iso: string;
          name: string;
          nativeName: string;
        };
      };
      raw: {
        text: string;
        lang: string;
      };
    }
  
    function translate(text: string, options: { from: string; to: string }): Promise<TranslateResponse>;
  
    export default translate;
  }
  