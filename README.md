<p align="center">

  <h1 align="center"><a href="https://sairajk.github.io/asia" target="_blank">ASIA: Adaptive 3D Segmentation using Few Image Annotations</a></h1>

  <p align="center">
    <a href="https://sairajk.github.io/" target="_blank"><strong>Sai Raj Kishore Perla</strong></a>
    ·
    <a href="https://aditya-vora.github.io/" target="_blank"><strong>Aditya Vora</strong></a>
    ·
    <a href="https://sauradip.github.io/" target="_blank"><strong>Sauradip Nag</strong></a>
    ·
    <a href="https://www.sfu.ca/~amahdavi/" target="_blank"><strong>Ali Mahdavi-Amiri</strong></a>
    ·
    <a href="https://www.cs.sfu.ca/~haoz/" target="_blank"><strong>Hao (Richard) Zhang</strong></a>
    <br />
    <i>SIGGRAPH Asia, 2025</i>
  </p>

  <p align="center">
    <a href="https://arxiv.org/abs/" target="_blank"><strong>arXiv</strong></a>
    |
    <a href="https://sairajk.github.io/asia" target="_blank"><strong>Project Page</strong></a>
  </p>

  <div  align="center">
    <a>
      <img src="https://github.com/sairajk/asia/blob/gh-pages/static/assets/teaser_v3.png" alt="Logo" width="100%">
    </a>
  </div>
</p>

We introduce ASIA (Adaptive 3D Segmentation using few Image Annotations), a novel framework that enables segmentation of possibly non-semantic and non-text-describable “parts” in 3D. Our segmentation is controllable through a few user-annotated in-the-wild images, which are easier to collect than multi-view images, less demanding to annotate than 3D models, and more precise than potentially ambiguous text descriptions. Our method leverages the rich priors of text-to-image diffusion models, such as Stable Diffusion (SD), to transfer segmentations from image space to 3D, even when the annotated and target objects differ significantly in geometry or structure. During training, we optimize a text token for each segment and fine-tune our model with a novel cross-view part correspondence loss. At inference, we segment multi-view renderings of the 3D mesh, fuse the labels in UV-space via voting, refine them with our novel Noise Optimization technique, and finally map the UV-labels back onto the mesh. ASIA provides a practical and generalizable solution for both semantic and non-semantic 3D segmentation tasks, outperforming existing methods by a noticeable margin in both quantitative and qualitative evaluations.

<h3 align="center">🚧 Code will be released soon. 🚧</h3>

## Citation

If you found our work helpful, please consider citing:

```bibtex
@article{perla2025asia,
    title={{ASIA}: Adaptive 3D Segmentation using Few Image Annotations},
    author = {Perla, Sai Raj Kishore and Vora, Aditya and Nag, Sauradip, Mahdavi-Amiri, Ali and Zhang, Hao},
    journal = {SIGGRAPH Asia Conference Papers},
    publisher = {ACM New York, NY, USA},
    year = {2025},
    doi = {10.1145/3757377.3763821},
    url = {https://github.com/sairajk/asia},
}
```

<!-- volume = {43},
    number = {4},
    articleno = {40}, -->
