import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
const workflow=readFileSync(new URL('../.github/workflows/auto-merge-article-prs.yml',import.meta.url),'utf8');
const gate=workflow.split("python3 - <<'PY' > gate.env\n")[1].split('\n          PY')[0].split('\n').map(s=>s.slice(10)).join('\n');
function eligible(changed,files,sha='a'.repeat(40)) {
  const folder=mkdtempSync(join(tmpdir(),'merge-gate-'));
  try {
    const pr={state:'open',draft:false,title:'Publish article-123',changed_files:changed,head:{repo:{full_name:'owner/repo'},sha},base:{repo:{full_name:'owner/repo'},ref:'main',sha:'b'.repeat(40)}};
    writeFileSync(join(folder,'pr.json'),JSON.stringify(pr));
    writeFileSync(join(folder,'pr-files.json'),JSON.stringify(files));
    return execFileSync('python3',['-c',gate],{cwd:folder,encoding:'utf8'}).includes('eligible=true');
  } finally {rmSync(folder,{recursive:true,force:true});}
}
test('partial pages, executable changes and unsafe SHAs cannot reach the checkout',()=>{
  assert.equal(eligible(1,[{filename:'articles/article-123.html'}]),true);
  assert.equal(eligible(101,Array.from({length:100},()=>({filename:'articles/article-123.html'}))),false);
  assert.equal(eligible(2,[{filename:'articles/article-123.html'},{filename:'.github/scripts/validate-immigration-article-pr.py'}]),false);
  assert.equal(eligible(1,[{filename:'articles/article-123.html'}],'invalid-sha'),false);
  assert.equal(eligible(0,[]),false);
});
