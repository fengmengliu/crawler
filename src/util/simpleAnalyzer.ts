import { Analyzer } from './crawler';

export default class TestAnalyzer implements Analyzer{
  public analyze(html: string, filepath: string) {
    return html;
  }
}