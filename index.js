const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(/* url do site que se deseja raspar as imagens */ ,{
    waitUntil : 'networkidle0',
  });

  await page.setViewport({
    width: 1520,
    height: 3400
});

  await autoScroll(page);

  const imgList = await page.evaluate(() => {
    // toda essa funçao será executada no browser
    // vamos pegar todas as imagens que estão na parte de posts
    const nodeList = document.querySelectorAll(/* campo onde estão as imagens **/)

    //transformar o NodeList em array
    const imgArray = Array.from(nodeList);

    // //transformar os nodes (elementos html) em objetos JS
    const imgList = imgArray.map((images) => ({
      src : images.src
    }))
    // //colocar para fora da função
    return imgList
  })
  // await browser.close();

  //escrever os dados em um arquivo local(json)
  fs.writeFile('images.json', JSON.stringify(imgList, null, 1), err => {
    if (err) throw new Error('Erro ao executar o código');

    console.log('Executado com sucesso!')
  })
})();

//Função para fazer a função de descer a página, para pegar as imagens que também estão em baixo

async function autoScroll(page){
  await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if(totalHeight >= scrollHeight){
                  clearInterval(timer);
                  resolve();
              }
          }, 100);
      });
  });
}