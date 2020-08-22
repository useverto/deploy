export class ReferenceFixer {

  private src: string;
  private level: number;

  private readonly slashes: string;

  constructor (src: string, level: number) {
    this.src = src;
    this.level = level;
    this.slashes = ("../").repeat(level);
  }

  public getSrc (): string {
    this.replaceBase();
    this.replaceHrefs();
    this.replaceSrcs();
    this.replaceEmbededScriptSources();
    this.fixRemainingHrefsAndSrcs();

    return this.src;
  }

  private replaceBase () {
    this.src = this.src.replace("<base href=/ >", `<base href=${ this.level ? this.slashes : "./" } >`); // todo make this relative to level
  }

  private replaceHrefs () {
    this.src = this.src.replace(new RegExp('(href=)\/', "g"), `href=${ this.level ? this.slashes : "./" }`);
    this.src = this.src.replace(new RegExp('(href=")\/', "g"), `href="${ this.level ? this.slashes : "./" }`);
  }

  private replaceEmbededScriptSources () {
    this.src = this.src.replace(/(?<=(<script\b[^>]*>([\s\S]*?))([\"|\'|\`]))(\/)(?=(.*)(\.js))(?=(([\s\S]*?)(<\/script>)))/gm, this.level ? this.slashes : "./");
  }

  private replaceSrcs () {
    this.src = this.src.replace(new RegExp('(src=)\/', "g"), `src=${ this.level ? this.slashes : "./" }`);
    this.src = this.src.replace(new RegExp('(src=")\/', "g"), `src="${ this.level ? this.slashes : "./" }`);
  }

  private fixRemainingHrefsAndSrcs () {

    // this script will be injected to replace hrefs
    const fixer = `</script>
      <script>
        /*////// VERTO DEPLOY SCRIPT ///////*/
        const observer = new MutationObserver(updateReferences);
        function updateReferences (mutationsList) {
          for(const record of mutationsList) {
            if(record.type !== "attributes" || record.attributeName === null) continue;
            if(record.target === null || record.target === undefined) continue;
            if(record.attributeName === "href") {
              if(record.target.href === undefined || record.target.href === "" || record.target.href.split(window.location.host)[1] === undefined) continue;
              if(record.target.href.includes(window.location.href.split('/')[3])) continue;
              record.target.href = "/" + window.location.href.split('/')[3] + record.target.href.split(window.location.host)[1];
            }
            if(record.attributeName === "src") {
              if(record.target.src === undefined || record.target.src === "" || record.target.src.split(window.location.host)[1] === undefined) continue;
              if(record.target.src.includes(window.location.href.split('/')[3])) continue;
              record.target.src = "/" + window.location.href.split('/')[3] + record.target.src.split(window.location.host)[1];
            }
          }
        }
        observer.observe(document.body, { attributes: true, childList: true, subtree: true });
        /*////// VERTO DEPLOY SCRIPT END ///////*/
      </script>
    `;
    //inject after last script tag
    this.src = this.src.replace(/(<\/script>)( *)$/, fixer);

  }

}

export class CssReferenceFixer {

  private src: string;
  private level: number;

  private readonly slashes: string;

  constructor (src: string, level: number) {
    this.src = src;
    this.level = level;
    this.slashes = ("../").repeat(level);
  }

  public getSrc (): string {
    this.replaceUrls();

    return this.src;
  }

  private replaceUrls () {
    this.src = this.src.replace(/(?<=(url\((["|']?)( *)))(\/)(?=(([^ ])*)(["|']?)(\)))/g, this.level ? this.slashes : "./");
  }

}

export class JavaScriptReferenceFixer {

  private src: string;

  constructor (src: string, level: number) {
    this.src = src;
  }

  private getSrc (): string {
    this.fixGoTo();

    return this.src;
  }

  private fixGoTo () {
    // todo
    // create goto function replacer
    // this is function Qt inside of client.767d9825.js
    // var "t" is the goto path
  }

}