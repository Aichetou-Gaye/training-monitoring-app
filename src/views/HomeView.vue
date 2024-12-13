<template>
  <div class="text-center mt-4">
    <h1 class="fw-bold">gggggggggggggg</h1>
    <p class="lead">wsssss</p>
  </div>
  <div class="text-center">
    <div id="carouselExampleSlidesOnly" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="/src/assets/img1.jpg" class="d-block w-100" alt="Image 1" />
        </div>
        <div class="carousel-item">
          <img src="/src/assets/img2.jpg" class="d-block w-100" alt="Image 2" />
        </div>
        <div class="carousel-item">
          <img src="/src/assets/img3.jpg" class="d-block w-100" alt="Image 3" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.carousel-item img {
  height: 400px;
  object-fit: cover;
}

.text-center {
  padding: 20px;
}

h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
}

p.lead {
  font-size: 1.2rem;
  color: #555;
}
</style>
