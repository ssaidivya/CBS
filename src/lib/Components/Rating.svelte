<script>
    export let value;
  </script>
  
  <style>
    .star {
      display: flex;
      size:500px;
      background-color: transparent;
      font-size: 100px;
    }
  
    .star svg {
      fill: none;
      stroke: #ff9900;
      stroke-width: 1.5px;
      stroke-linejoin: round;
      stroke-linecap: round;
      transition: stroke 0.2s ease;
      cursor: pointer;
    }
  
    .star:hover svg,
    .star.filled svg {
      stroke: #ff9900; 
    }
  </style>
  
  <div>
    Rating
  </div>
  <div class="star">
    {#each [1, 2, 3, 4, 5] as starValue}
      {#if starValue <= value}
        {#if starValue === value - 0.5}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1L15.09 8.26L23 9.27L17 14.14L18.18 22L12 17.77L5.82 22L7 14.14L1 9.27L8.91 8.26L12 1Z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        {:else}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1L15.09 8.26L23 9.27L17 14.14L18.18 22L12 17.77L5.82 22L7 14.14L1 9.27L8.91 8.26L12 1Z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        {/if}
      {:else}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 1L15.09 8.26L23 9.27L17 14.14L18.18 22L12 17.77L5.82 22L7 14.14L1 9.27L8.91 8.26L12 1Z" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      {/if}
    {/each}
  </div>
  