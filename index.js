const onDOMIsReady = () => {
    console.log('!!!');
    init();
  }
  const init = () => {
    document.querySelector("#play").addEventListener("click",onButtonPlayClicked);
  }
  
  const onButtonPlayClicked = () => {
    document.querySelector("#first_screen").classList.add('hidden')
    document.querySelector("#second_screen").classList.remove('hidden')
     console.log('Click button');
  }
  const main = () => {
    if (document.readyState === 'complete') onDOMIsReady();
    else {
      document.addEventListener('readystatechange', () => {
        if (document.readyState === 'complete') onDOMIsReady();
      });
    }
  };
  main();