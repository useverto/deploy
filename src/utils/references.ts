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
    this.fixRemainingHrefs();

    return this.src;
  }

  private replaceBase () {
    this.src = this.src.replace("<base href=/ >", "<base href=./ >"); // todo make this relative to level
  }

  private replaceHrefs () {
    this.src = this.src.replace(new RegExp('(href=)\/', "g"), `href=${ this.slashes }./`);
    this.src = this.src.replace(new RegExp('(href=")\/', "g"), `href="${ this.slashes }./`);
  }

  private replaceEmbededScriptSources () {
    this.src = this.src.replace(/(?<=(<script\b[^>]*>([\s\S]*?))([\"|\'|\`]))(\/)(?=(.*)(\.js))(?=(([\s\S]*?)(<\/script>)))/gm, `${ this.slashes }./`);
  }

  private replaceSrcs () {
    this.src = this.src.replace(new RegExp('(src=)\/', "g"), `src=${ this.slashes }./`);
    this.src = this.src.replace(new RegExp('(src=")\/', "g"), `src="${ this.slashes }./`);
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
    this.src = this.src.replace(new RegExp('(?<=((url\()([\"|\']?)( *)))(\/)(?=((.*)([\"|\']?)\)))', "g"), `${ this.slashes }./`);
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